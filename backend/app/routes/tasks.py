from datetime import date
from fastapi import APIRouter, Depends, HTTPException, Query, Response
from sqlalchemy import select, func
from sqlalchemy.orm import Session
from ..database import get_db
from ..models import Task, User
from ..schemas import TaskCreate, TaskUpdate, TaskOut, StatsOut
from ..auth import get_current_user

router = APIRouter(prefix="/api/tasks", tags=["Tasks"])

@router.get("", response_model=list[TaskOut])
def list_tasks(
    status_filter: str = Query(default="all", alias="status", pattern="^(all|pending|completed|overdue)$"),
    search: str = Query(default="", max_length=100),
    db: Session = Depends(get_db),
    user: User = Depends(get_current_user),
):
    query = select(Task).where(Task.owner_id == user.id)
    if status_filter == "pending":
        query = query.where(Task.completed.is_(False))
    elif status_filter == "completed":
        query = query.where(Task.completed.is_(True))
    elif status_filter == "overdue":
        query = query.where(Task.completed.is_(False), Task.due_date < date.today())
    if search.strip():
        query = query.where(Task.title.ilike(f"%{search.strip()}%"))
    return list(db.scalars(query.order_by(Task.completed.asc(), Task.due_date.asc(), Task.created_at.desc())).all())

@router.post("", response_model=TaskOut, status_code=201)
def create_task(payload: TaskCreate, db: Session = Depends(get_db), user: User = Depends(get_current_user)):
    task = Task(**payload.model_dump(), owner_id=user.id)
    db.add(task)
    db.commit()
    db.refresh(task)
    return task

def owned_task(task_id: int, db: Session, user: User) -> Task:
    task = db.scalar(select(Task).where(Task.id == task_id, Task.owner_id == user.id))
    if not task:
        raise HTTPException(status_code=404, detail="Task not found")
    return task

@router.patch("/{task_id}", response_model=TaskOut)
def update_task(task_id: int, payload: TaskUpdate, db: Session = Depends(get_db), user: User = Depends(get_current_user)):
    task = owned_task(task_id, db, user)
    for key, value in payload.model_dump(exclude_unset=True).items():
        setattr(task, key, value)
    db.commit()
    db.refresh(task)
    return task

@router.delete("/{task_id}", status_code=204)
def delete_task(task_id: int, db: Session = Depends(get_db), user: User = Depends(get_current_user)):
    task = owned_task(task_id, db, user)
    db.delete(task)
    db.commit()
    return Response(status_code=204)

@router.get("/stats", response_model=StatsOut)
def task_stats(db: Session = Depends(get_db), user: User = Depends(get_current_user)):
    tasks = list(db.scalars(select(Task).where(Task.owner_id == user.id)).all())
    total = len(tasks)
    completed = sum(t.completed for t in tasks)
    overdue = sum((not t.completed) and t.due_date is not None and t.due_date < date.today() for t in tasks)
    return StatsOut(total=total, completed=completed, pending=total-completed, overdue=overdue)

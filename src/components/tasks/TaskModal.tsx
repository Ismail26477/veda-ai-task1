import { useState, useEffect } from 'react';
import { Task, BusinessCategory, Priority, TaskStatus, BUSINESS_CATEGORIES, PRIORITIES, STATUSES } from '@/types/task';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

interface TaskModalProps {
  open: boolean;
  onClose: () => void;
  onSave: (task: Omit<Task, 'id' | 'createdAt'>) => void;
  editTask?: Task | null;
}

const defaultFormData = {
  title: '',
  description: '',
  priority: 'medium' as Priority,
  dueDate: new Date().toISOString().split('T')[0],
  time: '09:00',
  location: '',
  category: 'real-estate' as BusinessCategory,
  status: 'pending' as TaskStatus,
  clientName: '',
  notes: '',
};

export function TaskModal({ open, onClose, onSave, editTask }: TaskModalProps) {
  const [formData, setFormData] = useState(defaultFormData);

  useEffect(() => {
    if (editTask) {
      setFormData({
        title: editTask.title,
        description: editTask.description,
        priority: editTask.priority,
        dueDate: editTask.dueDate,
        time: editTask.time,
        location: editTask.location || '',
        category: editTask.category,
        status: editTask.status,
        clientName: editTask.clientName || '',
        notes: editTask.notes || '',
      });
    } else {
      setFormData(defaultFormData);
    }
  }, [editTask, open]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(formData);
    onClose();
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-lg max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="font-display text-xl">
            {editTask ? 'Edit Task' : 'Create New Task'}
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4 pt-4">
          {/* Title */}
          <div className="space-y-2">
            <Label htmlFor="title">Task Title *</Label>
            <Input
              id="title"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              placeholder="Enter task title"
              required
            />
          </div>

          {/* Description */}
          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              placeholder="Add details about this task"
              rows={3}
            />
          </div>

          {/* Category & Priority */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Business Category *</Label>
              <Select
                value={formData.category}
                onValueChange={(value: BusinessCategory) =>
                  setFormData({ ...formData, category: value })
                }
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {BUSINESS_CATEGORIES.map((cat) => (
                    <SelectItem key={cat.value} value={cat.value}>
                      {cat.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>Priority *</Label>
              <Select
                value={formData.priority}
                onValueChange={(value: Priority) =>
                  setFormData({ ...formData, priority: value })
                }
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {PRIORITIES.map((pri) => (
                    <SelectItem key={pri.value} value={pri.value}>
                      {pri.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Date & Time */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="dueDate">Due Date *</Label>
              <Input
                id="dueDate"
                type="date"
                value={formData.dueDate}
                onChange={(e) => setFormData({ ...formData, dueDate: e.target.value })}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="time">Time *</Label>
              <Input
                id="time"
                type="time"
                value={formData.time}
                onChange={(e) => setFormData({ ...formData, time: e.target.value })}
                required
              />
            </div>
          </div>

          {/* Status (only for edit) */}
          {editTask && (
            <div className="space-y-2">
              <Label>Status</Label>
              <Select
                value={formData.status}
                onValueChange={(value: TaskStatus) =>
                  setFormData({ ...formData, status: value })
                }
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {STATUSES.map((status) => (
                    <SelectItem key={status.value} value={status.value}>
                      {status.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          )}

          {/* Location */}
          <div className="space-y-2">
            <Label htmlFor="location">Location (Optional)</Label>
            <Input
              id="location"
              value={formData.location}
              onChange={(e) => setFormData({ ...formData, location: e.target.value })}
              placeholder="Add location"
            />
          </div>

          {/* Client Name */}
          <div className="space-y-2">
            <Label htmlFor="clientName">Client Name (Optional)</Label>
            <Input
              id="clientName"
              value={formData.clientName}
              onChange={(e) => setFormData({ ...formData, clientName: e.target.value })}
              placeholder="Client or contact name"
            />
          </div>

          {/* Notes */}
          <div className="space-y-2">
            <Label htmlFor="notes">Additional Notes</Label>
            <Textarea
              id="notes"
              value={formData.notes}
              onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
              placeholder="Any additional notes"
              rows={2}
            />
          </div>

          {/* Actions */}
          <div className="flex gap-3 pt-4">
            <Button type="button" variant="outline" className="flex-1" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit" className="flex-1">
              {editTask ? 'Save Changes' : 'Create Task'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}

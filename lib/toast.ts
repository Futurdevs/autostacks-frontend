import toast from 'react-hot-toast';

export const showToast = {
  success: (message: string, id: string) => {
    toast.success(message, {
      style: {
        background: 'hsl(var(--card))',
        color: 'hsl(var(--foreground))',
        border: '1px solid hsl(var(--primary))',
      },
      iconTheme: {
        primary: 'hsl(var(--primary))',
        secondary: 'hsl(var(--card))',
      },
      id: id,
    });
  },
  error: (message: string, id: string) => {
    toast.error(message, {
      style: {
        background: 'hsl(var(--card))',
        color: 'hsl(var(--foreground))',
        border: '1px solid hsl(var(--destructive))',
      },
      iconTheme: {
        primary: 'hsl(var(--destructive))',
        secondary: 'hsl(var(--card))',
      },
      id: id,
    });
  },
  loading: (message: string, id: string) => {
    return toast.loading(message, {
      style: {
        background: 'hsl(var(--card))',
        color: 'hsl(var(--foreground))',
        border: '1px solid hsl(var(--muted))',
      },
      id: id,
    });
  },
  dismiss: (toastId: string) => {
    if (toastId) {
      toast.dismiss(toastId);
    } else {
      toast.dismiss();
    }
  },
}; 
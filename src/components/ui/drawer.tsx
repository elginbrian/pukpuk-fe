import * as React from "react";
import { X } from "lucide-react";
import { cn } from "../../utils/utils";

interface DrawerProps {
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
  children: React.ReactNode;
}

const DrawerContext = React.createContext<{
  open: boolean;
  setOpen: (open: boolean) => void;
}>({
  open: false,
  setOpen: () => {},
});

const Drawer = ({ open: controlledOpen, onOpenChange, children }: DrawerProps) => {
  const [uncontrolledOpen, setUncontrolledOpen] = React.useState(false);
  
  const open = controlledOpen !== undefined ? controlledOpen : uncontrolledOpen;
  const setOpen = React.useCallback((value: boolean) => {
    if (onOpenChange) {
      onOpenChange(value);
    } else {
      setUncontrolledOpen(value);
    }
  }, [onOpenChange]);

  return (
    <DrawerContext.Provider value={{ open, setOpen }}>
      {children}
    </DrawerContext.Provider>
  );
};
Drawer.displayName = "Drawer";

const DrawerTrigger = ({ children, asChild }: { children: React.ReactNode; asChild?: boolean }) => {
  const { setOpen } = React.useContext(DrawerContext);
  
  if (asChild && React.isValidElement(children)) {
    const child = children as React.ReactElement<{ onClick?: (e: React.MouseEvent) => void }>;
    return React.cloneElement(child, {
      onClick: (e: React.MouseEvent) => {
        setOpen(true);
        child.props.onClick?.(e);
      },
    });
  }
  
  return (
    <button onClick={() => setOpen(true)}>
      {children}
    </button>
  );
};
DrawerTrigger.displayName = "DrawerTrigger";

const DrawerPortal = ({ children }: { children: React.ReactNode }) => {
  const { open } = React.useContext(DrawerContext);
  if (!open) return null;
  return <>{children}</>;
};
DrawerPortal.displayName = "DrawerPortal";

const DrawerOverlay = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => {
  const { setOpen } = React.useContext(DrawerContext);
  
  return (
    <div 
      ref={ref}
      className={cn(
        "fixed inset-0 z-50 bg-black/80 backdrop-blur-sm",
        "data-[state=open]:animate-in data-[state=closed]:animate-out",
        "data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0",
        className
      )}
      onClick={() => setOpen(false)}
      {...props}
    />
  );
});
DrawerOverlay.displayName = "DrawerOverlay";

const DrawerContent = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, children, ...props }, ref) => {
  const { open, setOpen } = React.useContext(DrawerContext);
  
  React.useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    
    if (open) {
      document.addEventListener("keydown", handleEscape);
      document.body.style.overflow = "hidden";
    }
    
    return () => {
      document.removeEventListener("keydown", handleEscape);
      document.body.style.overflow = "unset";
    };
  }, [open, setOpen]);
  
  if (!open) return null;
  
  return (
    <DrawerPortal>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        <DrawerOverlay />
        <div
          ref={ref}
          className={cn(
            "relative z-50 w-full max-w-2xl",
            "rounded-lg border bg-background shadow-lg",
            "flex flex-col max-h-[85vh]",
            "data-[state=open]:animate-in data-[state=closed]:animate-out",
            "data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0",
            "data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95",
            "data-[state=closed]:slide-out-to-left-1/2 data-[state=closed]:slide-out-to-top-[48%]",
            "data-[state=open]:slide-in-from-left-1/2 data-[state=open]:slide-in-from-top-[48%]",
            "duration-200",
            className,
          )}
          onClick={(e) => e.stopPropagation()}
          {...props}
        >
          {children}
        </div>
      </div>
    </DrawerPortal>
  );
});
DrawerContent.displayName = "DrawerContent";

const DrawerHeader = ({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) => (
  <div className={cn("flex flex-col space-y-1.5 p-6", className)} {...props} />
);
DrawerHeader.displayName = "DrawerHeader";

const DrawerFooter = ({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) => (
  <div className={cn("flex items-center justify-end gap-2 p-6 border-t", className)} {...props} />
);
DrawerFooter.displayName = "DrawerFooter";

const DrawerTitle = React.forwardRef<
  HTMLHeadingElement,
  React.HTMLAttributes<HTMLHeadingElement>
>(({ className, ...props }, ref) => (
  <h2 ref={ref} className={cn("text-lg font-semibold leading-none tracking-tight", className)} {...props} />
));
DrawerTitle.displayName = "DrawerTitle";

const DrawerDescription = React.forwardRef<
  HTMLParagraphElement,
  React.HTMLAttributes<HTMLParagraphElement>
>(({ className, ...props }, ref) => (
  <p ref={ref} className={cn("text-sm text-muted-foreground", className)} {...props} />
));
DrawerDescription.displayName = "DrawerDescription";

const DrawerClose = ({ children, asChild }: { children: React.ReactNode; asChild?: boolean }) => {
  const { setOpen } = React.useContext(DrawerContext);
  
  if (asChild && React.isValidElement(children)) {
    const child = children as React.ReactElement<{ onClick?: (e: React.MouseEvent) => void }>;
    return React.cloneElement(child, {
      onClick: (e: React.MouseEvent) => {
        setOpen(false);
        child.props.onClick?.(e);
      },
    });
  }
  
  return (
    <button onClick={() => setOpen(false)}>
      {children}
    </button>
  );
};
DrawerClose.displayName = "DrawerClose";

export {
  Drawer,
  DrawerPortal,
  DrawerOverlay,
  DrawerTrigger,
  DrawerClose,
  DrawerContent,
  DrawerHeader,
  DrawerFooter,
  DrawerTitle,
  DrawerDescription,
};

import { cn } from "@/lib/utils";

interface ProductPriceProps {
  price: number;
  discount?: number;
  size?: "sm" | "md" | "lg";
  className?: string;
}

const ProductPrice = ({ price, discount, size = "md", className }: ProductPriceProps) => {
  const hasDiscount = discount && discount > 0;
  const newPrice = hasDiscount ? price - discount : price;
  const discountPercentage = hasDiscount ? (discount / price) * 100 : 0;
  const displayPercentage = discountPercentage < 1 
    ? discountPercentage.toFixed(1) 
    : Math.round(discountPercentage);

  const sizeClasses = {
    sm: {
      mrp: "text-[10px]",
      price: "text-xs",
      newPrice: "text-sm",
      badge: "text-[8px] px-1 py-0.5"
    },
    md: {
      mrp: "text-xs",
      price: "text-sm",
      newPrice: "text-base",
      badge: "text-[10px] px-2 py-0.5"
    },
    lg: {
      mrp: "text-sm",
      price: "text-base",
      newPrice: "text-2xl",
      badge: "text-xs px-2.5 py-1"
    },
  };

  const currentSize = sizeClasses[size];

  return (
    <div className={cn("flex items-center gap-2 font-heading", className)}>
      {hasDiscount ? (
        <>
          <div className="flex items-center gap-1 text-muted-foreground opacity-60">
            <span className={currentSize.mrp}>MRP</span>
            <span className={cn(currentSize.price, "line-through")}>
              ₹{price.toLocaleString()}
            </span>
          </div>
          <span className={cn(currentSize.newPrice, "font-bold text-foreground")}>
            ₹{newPrice.toLocaleString()}
          </span>
          <span className={cn(
            currentSize.badge,
            "bg-[#ff3b6b] text-white font-bold rounded-sm uppercase tracking-wider"
          )}>
            {displayPercentage}% OFF!
          </span>
        </>
      ) : (
        <span className={cn(currentSize.newPrice, "font-bold text-foreground")}>
          ₹{price.toLocaleString()}
        </span>
      )}
    </div>
  );
};

export default ProductPrice;

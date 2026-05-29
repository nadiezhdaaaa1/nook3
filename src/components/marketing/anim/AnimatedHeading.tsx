import { motion, type Variants } from "framer-motion";
import { Children, Fragment, isValidElement, type ReactNode } from "react";

const container: Variants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.05, delayChildren: 0.05 } },
};

const word: Variants = {
  hidden: { opacity: 0, y: 8 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.85, ease: [0.22, 1, 0.36, 1] } },
};

function splitNode(node: ReactNode, key: string): ReactNode[] {
  const out: ReactNode[] = [];
  Children.forEach(node, (child, i) => {
    if (typeof child === "string") {
      const parts = child.split(/(\s+)/);
      parts.forEach((part, j) => {
        if (part === "") return;
        if (/^\s+$/.test(part)) {
          out.push(<Fragment key={`${key}-${i}-${j}-s`}>{part}</Fragment>);
        } else {
          out.push(
            <motion.span
              key={`${key}-${i}-${j}`}
              variants={word}
              style={{ display: "inline-block", willChange: "transform, opacity" }}
            >
              {part}
            </motion.span>,
          );
        }
      });
    } else if (isValidElement(child)) {
      if (child.type === "br") {
        out.push(<Fragment key={`${key}-${i}-br`}>{child}</Fragment>);
        return;
      }
      out.push(
        <motion.span
          key={`${key}-${i}`}
          variants={word}
          style={{ display: "inline-block", willChange: "transform, opacity" }}
        >
          {child}
        </motion.span>,
      );
    } else if (child != null && child !== false) {
      out.push(child);
    }
  });
  return out;
}

export function AnimatedHeading({
  children,
  className,
  as: Tag = "span",
}: {
  children: ReactNode;
  className?: string;
  as?: "h1" | "h2" | "h3" | "span";
}) {
  const MotionTag = motion[Tag] as typeof motion.span;
  return (
    <MotionTag
      className={className}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: 0.3 }}
      variants={container}
    >
      {splitNode(children, "w")}
    </MotionTag>
  );
}

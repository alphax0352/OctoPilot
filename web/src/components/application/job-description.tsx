import Markdown from "react-markdown";
import remarkGfm from "remark-gfm";

import {
  Sheet,
  SheetContent,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { ScrollArea } from "../ui/scroll-area";

export function JobDescription({
  company,
  title,
  description,
}: {
  company: string;
  title: string;
  description: string;
}) {
  return (
    <Sheet>
      <SheetTrigger>
        <div className="line-clamp-1 underline">View</div>
      </SheetTrigger>
      <SheetContent className="flex flex-col w-full h-screen sm:max-w-4xl pr-1">
        <SheetTitle className="text-xl font-semibold">
          {title} at {company}
        </SheetTitle>
        <ScrollArea className="flex-1 h-full leading-relaxed text-primary/90">
          <div className="pr-4 prose prose-sm dark:prose-invert max-w-none">
            <Markdown remarkPlugins={[remarkGfm]}>{description}</Markdown>
          </div>
        </ScrollArea>
      </SheetContent>
    </Sheet>
  );
}

import {
  Sheet,
  SheetContent,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { ScrollArea } from "../ui/scroll-area";

export function CoverLetter({ coverLetter }: { coverLetter: string }) {
  return (
    <Sheet>
      <SheetTrigger>
        <div className="line-clamp-1 underline">View</div>
      </SheetTrigger>
      <SheetContent className="flex flex-col w-full h-screen sm:max-w-4xl pr-1">
        <SheetTitle className="text-xl font-semibold">Cover Letter</SheetTitle>
        <ScrollArea className="flex-1 h-full leading-relaxed text-primary/90">
          {coverLetter}
        </ScrollArea>
      </SheetContent>
    </Sheet>
  );
}

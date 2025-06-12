import Image from "next/image";

export function AuthTitle() {
  return (
    <div className="absolute top-4 left-4 flex items-center gap-2">
      <Image src="/images/logo.png" alt="Octopilot" width={36} height={36} />
      <div className="font-bold text-2xl">Octopilot</div>
    </div>
  );
}

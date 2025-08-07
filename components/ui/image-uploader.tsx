import Image from "next/image";
import {Input} from "@/components/ui/input";
import {Pencil} from "lucide-react";

type ImageUploadLabelProps = {
    id: string;
    src: string | undefined;
    onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
    alt?: string;
};

export default function ImageUploadLabel({id, src, onChange, alt = "Aperçu de l'image"}: ImageUploadLabelProps) {
    return (
        <div className="flex flex-col items-center">
            <label htmlFor={id} className="cursor-pointer hover:brightness-70 relative w-[100px] h-[100px]">
                <Image
                    src={src || "/placeholder.jpg"}
                    alt={alt}
                    width={100}
                    height={100}
                    className="rounded-md h-[100px] w-[100px] object-cover drop-shadow-lg"
                />
                <Pencil className="w-6 h-6 stroke-2 text-muted-foreground absolute top-1/2 right-1/2 translate-x-1/2 -translate-y-1/2"/>
            </label>
            <Input
                id={id}
                type="file"
                accept="image/*"
                hidden
                onChange={onChange}
            />
        </div>
    );
}
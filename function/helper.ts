import * as XLSX from "xlsx";
import {CreateAccessoire, CreateCostume} from "@/type";

function mapCostume(row: any): CreateCostume {
    return {
        photo: undefined,
        descriptif: row.descriptif ?? undefined,
        sexe: row.sexe ?? undefined,
        type: row.type ?? undefined,
        tissu_motif: row.tissu_motif ?? undefined,
        couleur: row.couleur ?? undefined,
        taille: row.taille ?? undefined,
        quantite: row.quantite ?? undefined,
        emplacement: row.emplacement ?? undefined,
        portant: row.portant ?? undefined,
        photo_prise_par: row.photo_prise_par ?? undefined,
    };
}

function mapAccessoire(row: any): CreateAccessoire {
    return {
        photo: undefined,
        descriptif: row.descriptif ?? undefined,
        sexe: row.sexe ?? undefined,
        type: row.type ?? undefined,
        tissu_motif: row.tissu_motif ?? undefined,
        couleur: row.couleur ?? undefined,
        taille: row.taille ?? undefined,
        quantite: row.quantite ?? undefined,
        divers: row.divers ?? undefined,
        portant: row.portant ?? undefined,
        photo_prise_par: row.photo_prise_par ?? undefined,
    };
}

export function parseExcelBuffer(buffer: ArrayBuffer | Buffer) {
    const nodeBuffer = Buffer.isBuffer(buffer) ? buffer : Buffer.from(new Uint8Array(buffer));
    const workbook = XLSX.read(nodeBuffer, { type: "buffer" });

    const costumesSheet = workbook.Sheets[workbook.SheetNames[0]];
    const accessoiresSheet = workbook.Sheets[workbook.SheetNames[1]];

    const costumes = costumesSheet
        ? XLSX.utils.sheet_to_json(costumesSheet).map(mapCostume)
        : [];
    const accessoires = accessoiresSheet
        ? XLSX.utils.sheet_to_json(accessoiresSheet).map(mapAccessoire)
        : [];

    return { costumes, accessoires };
}
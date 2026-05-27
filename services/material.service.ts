import { api } from "@/lib/api";
import { Material } from "@/models/material/Material.model";

function normalizeMaterial(response: unknown): Material {
  if (response && typeof response === "object") {
    const record = response as Record<string, unknown>;

    if (typeof record.materialId === "number") {
      return record as Material;
    }

    const nestedMaterial = Object.values(record).find(
      (value) =>
        value &&
        typeof value === "object" &&
        typeof (value as Record<string, unknown>).materialId === "number",
    );

    if (nestedMaterial) {
      return nestedMaterial as Material;
    }
  }

  throw new Error("Material details are unavailable.");
}

export async function getMaterialById(materialId: string): Promise<Material> {
  const response = await api.get(
    `/material/get_material_by_id/${materialId}`,
    {},
    true,
  );

  return normalizeMaterial(response);
}

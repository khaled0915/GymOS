import { db } from "@/lib/db";
import type { BodyMeasurement, PersonalRecord, MeasurementType, RecordType } from "@prisma/client";

export class ProgressRepository {
  static async logMeasurement(data: {
    userId: string;
    measurementType: MeasurementType;
    value: number;
    unit: string;
    measuredAt?: Date;
  }): Promise<BodyMeasurement> {
    return db.bodyMeasurement.create({
      data: {
        ...data,
        measuredAt: data.measuredAt ?? new Date(),
      },
    });
  }

  static async getMeasurements(userId: string, measurementType?: MeasurementType): Promise<BodyMeasurement[]> {
    return db.bodyMeasurement.findMany({
      where: {
        userId,
        ...(measurementType ? { measurementType } : {}),
      },
      orderBy: { measuredAt: "asc" },
    });
  }

  static async getPersonalRecords(userId: string, exerciseId?: string): Promise<(PersonalRecord & { exercise: { name: string } })[]> {
    return db.personalRecord.findMany({
      where: {
        userId,
        ...(exerciseId ? { exerciseId } : {}),
      },
      include: {
        exercise: { select: { name: true } },
      },
      orderBy: { achievedAt: "desc" },
    });
  }

  static async savePersonalRecord(data: {
    userId: string;
    exerciseId: string;
    recordType: RecordType;
    value: number;
    sourceSetId?: string;
  }): Promise<PersonalRecord> {
    return db.personalRecord.create({
      data,
    });
  }
}

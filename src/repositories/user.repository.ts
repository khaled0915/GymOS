import { db } from "@/lib/db";
import type { Prisma, User, Profile } from "@prisma/client";

export class UserRepository {
  static async findById(id: string): Promise<(User & { profile: Profile | null }) | null> {
    return db.user.findUnique({
      where: { id },
      include: { profile: true },
    });
  }

  static async findByEmail(email: string): Promise<User | null> {
    return db.user.findUnique({
      where: { email },
    });
  }

  static async create(data: Prisma.UserCreateInput): Promise<User> {
    return db.user.create({ data });
  }

  static async updateProfile(userId: string, data: Prisma.ProfileUncheckedUpdateInput): Promise<Profile> {
    return db.profile.upsert({
      where: { userId },
      create: {
        userId,
        dateOfBirth: data.dateOfBirth as Date | undefined,
        height: data.height as number | undefined,
        currentWeight: data.currentWeight as number | undefined,
        fitnessGoal: data.fitnessGoal as any,
        experienceLevel: data.experienceLevel as any,
        preferredUnit: data.preferredUnit as any,
        weeklyFrequency: data.weeklyFrequency as number | undefined,
      },
      update: data,
    });
  }
}

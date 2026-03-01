'use server';

import { prisma } from '@/lib/prisma';
import { revalidatePath } from 'next/cache';

// PROFILE
export async function updateProfile(id: string, formData: FormData) {
    await prisma.profile.update({
        where: { id },
        data: {
            name: formData.get('name') as string,
            role: formData.get('role') as string,
            tagline: formData.get('tagline') as string || '',
            phone: formData.get('phone') as string || '',
            email: formData.get('email') as string || '',
            about: formData.get('about') as string,
        }
    });
    revalidatePath('/');
    revalidatePath('/admin');
}

// EXPERIENCE
export async function addExperience() {
    await prisma.experience.create({
        data: {
            title: 'Nuevo Cargo',
            company: 'Nueva Empresa',
            period: 'Año - Año',
            description: 'Breve descripción del rol...',
            order: 99
        }
    });
    revalidatePath('/');
    revalidatePath('/admin');
}

export async function updateExperience(id: string, formData: FormData) {
    await prisma.experience.update({
        where: { id },
        data: {
            title: formData.get('title') as string,
            company: formData.get('company') as string,
            period: formData.get('period') as string,
            description: formData.get('description') as string,
        }
    });
    revalidatePath('/');
    revalidatePath('/admin');
}

export async function deleteExperience(id: string) {
    await prisma.experience.delete({ where: { id } });
    revalidatePath('/');
    revalidatePath('/admin');
}

// EDUCATION
export async function addEducation() {
    await prisma.education.create({
        data: {
            degree: 'Nuevo Título',
            institution: 'Institución Educativa',
            period: 'Año',
            order: 99
        }
    });
    revalidatePath('/');
    revalidatePath('/admin');
}

export async function updateEducation(id: string, formData: FormData) {
    await prisma.education.update({
        where: { id },
        data: {
            degree: formData.get('degree') as string,
            institution: formData.get('institution') as string,
            period: formData.get('period') as string,
        }
    });
    revalidatePath('/');
    revalidatePath('/admin');
}

export async function deleteEducation(id: string) {
    await prisma.education.delete({ where: { id } });
    revalidatePath('/');
    revalidatePath('/admin');
}

// PUBLICATIONS
export async function addPublication() {
    await prisma.publication.create({
        data: {
            content: '<strong>Autor. (Año).</strong> Título. Editorial.',
            order: 99
        }
    });
    revalidatePath('/');
    revalidatePath('/admin');
}

export async function updatePublication(id: string, formData: FormData) {
    await prisma.publication.update({
        where: { id },
        data: { content: formData.get('content') as string }
    });
    revalidatePath('/');
    revalidatePath('/admin');
}

export async function deletePublication(id: string) {
    await prisma.publication.delete({ where: { id } });
    revalidatePath('/');
    revalidatePath('/admin');
}

// COURSES
export async function addCourse() {
    await prisma.course.create({
        data: {
            title: 'Nuevo Curso (Año)',
            order: 99
        }
    });
    revalidatePath('/');
    revalidatePath('/admin');
}

export async function updateCourse(id: string, formData: FormData) {
    await prisma.course.update({
        where: { id },
        data: { title: formData.get('title') as string }
    });
    revalidatePath('/');
    revalidatePath('/admin');
}

export async function deleteCourse(id: string) {
    await prisma.course.delete({ where: { id } });
    revalidatePath('/');
    revalidatePath('/admin');
}

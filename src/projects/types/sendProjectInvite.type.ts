export type projectInviteInput = {
    email: string;
    projectId: number;
    type: 'member' | 'supervisor';
    project_brand: string;
};

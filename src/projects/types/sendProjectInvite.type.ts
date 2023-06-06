export type projectInviteInput = {
    email: string;
    projectId: number;
    type: 'member' | 'supervisor' | 'co_supervisor';
    project_brand: string;
};

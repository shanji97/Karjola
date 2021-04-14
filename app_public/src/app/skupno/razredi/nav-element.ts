export interface NavElement {
    readonly naziv: string;
    readonly fields: NavElement[];
    readonly id: string;
    readonly final: boolean;
}

export class NavMeni implements NavElement {
    readonly naziv: string;
    readonly fields: NavElement[];
    readonly id: string;
    readonly final: boolean;

    constructor({ naziv, fields }: { naziv: string; fields: NavElement[]; }) {
        this.naziv = naziv;
        this.final = false;
        this.fields = fields;
        this.id = "";
    }
}

export class NavLink implements NavElement {
    readonly naziv: string;
    readonly fields: NavElement[];
    readonly id: string;
    readonly final: boolean;

    constructor({ id, naziv }: { id: string; naziv: string; }) {
        this.id = id;
        this.naziv = naziv;
        this.final = true;
        this.fields = [];
    }
}
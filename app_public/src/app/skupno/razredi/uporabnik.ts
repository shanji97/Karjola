export class Uporabnik {
   
    uporabniskoIme: string;
    ePosta: string;
    _id: string;
    jeAdmin: boolean;
}
export class UporabnikPrijava{
    ePosta:string;
    geslo: string;
}
export class UporabnikEmailZaObnovo{
    ePosta:string;
}
export class UporabnikPosodobitevGesla{
    trenutnoGeslo:string;
    novoGeslo:string;
    potrdiNovoGeslo:string;
    idUporabnika:string;
}

export class UporabnikPodrobnosti{
    
    _id:string;
    uporabniskoIme:string;
    ePosta:string;
    jeAdmin: string;
    posta:string;
    kraj:string;
}
export class UporabnikObnovaGesla{
    ePosta:string;
    zetonZaPosodobitev:string;
    novoGeslo: string;
    ponoviNovoGeslo: string;
}

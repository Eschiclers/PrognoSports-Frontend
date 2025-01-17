import {Circuit} from "@/types/Circuit";
import {Season} from "@/types/Season";
import {Competition} from "@/types/Competition";
import {IRaceSession, RaceSession} from "@/types/RaceSession";
import {BASE_URL} from "@/_services";

export interface IGrandPrix {
    id: string;
    name: string;
    code: string;
    competition: Competition;
    season: Season;
    round: number;
    circuit: Circuit;
    sessions: Array<IRaceSession>
    laps: number;
    suspended: boolean;
    hasPromoImage: boolean;
}

export class GrandPrix implements IGrandPrix {
    circuit: Circuit;
    code: string;
    competition: Competition;
    id: string;
    laps: number;
    name: string;
    sessions: Array<RaceSession>;
    round: number;
    season: Season;
    suspended: boolean;
    hasPromoImage: boolean;

    constructor(data: IGrandPrix) {
        this.circuit = new Circuit(data.circuit);
        this.code = data.code;
        this.competition = data.competition;
        this.id = data.id;
        this.laps = data.laps;
        this.name = data.name;
        this.round = data.round;
        this.season = data.season;
        this.suspended = data.suspended;
        this.hasPromoImage = data.hasPromoImage;

        this.sessions = [];
        data.sessions.forEach(session => {
            this.sessions.push(new RaceSession(session));
        })
    }

    firstDate(): Date {
        return new Date(Math.min(...this.sessions.map(ses => ses.date.getTime())));
    }

    lastDate(): Date {
        return new Date(Math.max(...this.sessions.map(ses => ses.date.getTime())));
    }

    gpLink(): Object {
        return {
            name: "gpdetails",
            params: {
                competition: this.competition.code,
                season: this.season.name,
                id: this.id,
            }
        };
    }

    public promoImage(): string {
        if (this.hasPromoImage) {
            return BASE_URL + `/gps/${this.competition.code}/${this.season.name}/${this.id}/image`;
        }

        // ToDo: coger la imagen por defecto de los assets
        return 'https://github.com/Cadiducho/PrognoSports-Frontend/blob/develop/src/assets/default_profile_image.jpg?raw=true';
    }
}
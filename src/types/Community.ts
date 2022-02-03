import {User} from "@/types/User";
import {Competition} from "@/types/Competition";
import {RuleSet} from "@/types/RuleSet";

export interface ICommunity {
    id: number;
    name: string;
    description: string;
    competition: Competition;
    image_url: string;
    open: boolean;
    owner: User;
    created: Date,
    members_amount: number;
    user_is_member: boolean;
    invitation: string;

    qualify_positions_predicted: number;
    race_positions_predicted: number;

    defaultRuleSet: RuleSet;
}

export class Community implements ICommunity {
    competition: Competition;
    created: Date;
    defaultRuleSet: RuleSet;
    description: string;
    id: number;
    image_url: string;
    invitation: string;
    members_amount: number;
    user_is_member: boolean;
    name: string;
    open: boolean;
    owner: User;
    qualify_positions_predicted: number;
    race_positions_predicted: number;

    constructor(data: ICommunity) {
        this.competition = data.competition;
        this.created = data.created;
        this.defaultRuleSet = new RuleSet(data.defaultRuleSet);
        this.description = data.description;
        this.id = data.id;
        this.image_url = data.image_url;
        this.invitation = data.invitation;
        this.members_amount = data.members_amount;
        this.user_is_member = data.user_is_member;
        this.name = data.name;
        this.open = data.open;
        this.owner = data.owner;
        this.qualify_positions_predicted = data.qualify_positions_predicted;
        this.race_positions_predicted = data.race_positions_predicted;
    }
}
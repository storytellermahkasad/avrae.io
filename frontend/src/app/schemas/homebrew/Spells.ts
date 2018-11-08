import {DiscordUser} from "../DiscordUser";

export const REQUIRED_SPELL_PROPS = ["name", "level", "school"];
export const SPELL_SCHOOLS = ["A", "V", "E", "I", "D", "N", "T", "C"];

export class Tome {
  name: string;
  owner: DiscordUser;
  editors: DiscordUser[];
  public: boolean;
  active: string[];
  server_active: string[];
  desc: string;
  image: string;
  spells?: Spell[];
  numSpells?: number;
  _id: { "$oid": string };
}

export class Spell {
  name: string;
  level: number;
  school: "A" | "V" | "E" | "I" | "D" | "N" | "T" | "C";
  classes: string;
  subclasses: string;
  time: string;
  range: string;
  components: SpellComponents;
  duration: string;
  ritual: boolean;
  description: string;
  higherlevels: string;
  concentration: boolean;
  automation: SpellAutomation;
  image?: string;

  constructor() {
    this.name = "New Spell";
    this.level = 1;
    this.school = "A";
    this.classes = "";
    this.subclasses = "";
    this.time = "";
    this.range = "";
    this.components = new SpellComponents();
    this.duration = "";
    this.ritual = false;
    this.description = "";
    this.higherlevels = "";
    this.concentration = false;
    this.automation = new SpellAutomation();
  }
}

export class SpellComponents {
  verbal: boolean;
  somatic: boolean;
  material: string;

  constructor() {
    this.verbal = false;
    this.somatic = false;
    this.material = "";
  }
}

export class SpellAutomation {

}

export function parseLevel(level) {
  if (level == 0) return "Cantrip";
  else if (level == 1) return "1st level";
  else if (level == 2) return "2nd level";
  else if (level == 3) return "3rd level";
  return `${level}th level`;
}

export function parseSchool(school) {
  if (school == "A") return "Abjuration";
  else if (school == "V") return "Evocation";
  else if (school == "E") return "Enchantment";
  else if (school == "I") return "Illusion";
  else if (school == "D") return "Divination";
  else if (school == "N") return "Necromancy";
  else if (school == "T") return "Transmutation";
  else if (school == "C") return "Conjuration";
  return school;
}

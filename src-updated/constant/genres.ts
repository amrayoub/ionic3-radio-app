import { Genre } from "./genre";
import { stations } from './stations';

export const genres = [
    new Genre('181_pop','Pop',stations.pop),
    new Genre('181_rock','Rock Channels',stations.rock),
    new Genre('181_country','Country',stations.country),
    new Genre('181_urban','Urban',stations.urban),
    new Genre('181_easy','Easy Listening',stations.easy_listening),
    new Genre('181_christmas','Christmas',stations.christmas)
]
import {EXAM_BOARD, TAG_HIERARCHY, TAG_ID, TAG_LEVEL} from "./constants";

// TODO this file would benefit from refactoring to being more OO. Many of its contents are lifted form Isaac Physics

interface BaseTag {
    id: TAG_ID;
    title: string;
    parent?: TAG_ID;
    comingSoon?: boolean;
}
export interface Tag extends BaseTag {
    type: TAG_LEVEL;
    level: number;
}

const baseTags: BaseTag[] = [
    // Categories
    {id: TAG_ID.theory, title: "Theory"},
    {id: TAG_ID.programming, title: "Programming"},

    // Theory sub-categories
    {id: TAG_ID.gcseToALevel, title: "GCSE to A-Level transition", parent: TAG_ID.theory},
    {id: TAG_ID.dataStructuresAndAlgorithms, title: "Data structures and algorithms", parent: TAG_ID.theory},
    {id: TAG_ID.computerNetworks, title: "Computer networks", parent: TAG_ID.theory},
    {id: TAG_ID.computerSystems, title: "Computer systems", parent: TAG_ID.theory},
    {id: TAG_ID.dataAndInformation, title: "Data and information", parent: TAG_ID.theory},
    // Programming sub-categories
    {id: TAG_ID.functionalProgramming, title: "Functional programming", parent: TAG_ID.programming},
    {id: TAG_ID.objectOrientedProgramming, title: "Object oriented programming", parent: TAG_ID.programming},
    {id: TAG_ID.proceduralProgramming, title: "Procedural programming", parent: TAG_ID.programming},

    // GCSE to A-Level transition topics
    {id: TAG_ID.gcseBooleanLogic, title: "Boolean logic", parent: TAG_ID.gcseToALevel, comingSoon: true},
    {id: TAG_ID.gcseProgrammingConcepts, title: "Programming concepts", parent: TAG_ID.gcseToALevel, comingSoon: true},
    {id: TAG_ID.gcseNetworking, title: "Networking", parent: TAG_ID.gcseToALevel, comingSoon: true},
    {id: TAG_ID.gcseDataRepresentation, title: "Data Representation", parent: TAG_ID.gcseToALevel, comingSoon: true},
    {id: TAG_ID.gcseSystems, title: "Systems", parent: TAG_ID.gcseToALevel, comingSoon: true},
    // Data structures and algorithms topics
    {id: TAG_ID.searchingSortingPathfinding, title: "Searching, sorting & pathfinding", parent: TAG_ID.dataStructuresAndAlgorithms, comingSoon: true},
    {id: TAG_ID.complexity, title: "Complexity", parent: TAG_ID.dataStructuresAndAlgorithms, comingSoon: true},
    {id: TAG_ID.modelsOfComputation, title: "Models of computation", parent: TAG_ID.dataStructuresAndAlgorithms, comingSoon: true},
    {id: TAG_ID.planningAndDebugging, title: "Planning and debugging", parent: TAG_ID.dataStructuresAndAlgorithms, comingSoon: true},
    {id: TAG_ID.dataStructuresTheory, title: "Data structures (theory)", parent: TAG_ID.dataStructuresAndAlgorithms, comingSoon: true},
    // Computer networks topics
    {id: TAG_ID.security, title: "Security", parent: TAG_ID.computerNetworks, comingSoon: true},
    {id: TAG_ID.networkStructure, title: "Network structure", parent: TAG_ID.computerNetworks, comingSoon: true},
    {id: TAG_ID.networkHardware, title: "Network hardware", parent: TAG_ID.computerNetworks, comingSoon: true},
    {id: TAG_ID.communication, title: "Communication", parent: TAG_ID.computerNetworks, comingSoon: true},
    {id: TAG_ID.internet, title: "Internet", parent: TAG_ID.computerNetworks, comingSoon: true},
    // Computer systems topics
    {id: TAG_ID.booleanLogic, title: "Boolean logic", parent: TAG_ID.computerSystems},
    {id: TAG_ID.architecture, title: "Architecture", parent: TAG_ID.computerSystems, comingSoon: true},
    {id: TAG_ID.hardware, title: "Hardware", parent: TAG_ID.computerSystems, comingSoon: true},
    {id: TAG_ID.operatingSystemsAndSoftware, title: "Operating systems and software", parent: TAG_ID.computerSystems, comingSoon: true},
    {id: TAG_ID.translators, title: "Translators", parent: TAG_ID.computerSystems, comingSoon: true},
    {id: TAG_ID.programmingLanguages, title: "Programming languages", parent: TAG_ID.computerSystems, comingSoon: true},
    // Data and information topics
    {id: TAG_ID.numberSystems, title: "Number systems", parent: TAG_ID.dataAndInformation, comingSoon: true},
    {id: TAG_ID.numberBases, title: "Number bases", parent: TAG_ID.dataAndInformation},
    {id: TAG_ID.representation, title: "Representation", parent: TAG_ID.dataAndInformation, comingSoon: true},
    {id: TAG_ID.transmission, title: "Transmission", parent: TAG_ID.dataAndInformation, comingSoon: true},
    {id: TAG_ID.databases, title: "Databases", parent: TAG_ID.dataAndInformation, comingSoon: true},
    {id: TAG_ID.bigData, title: "Big Data", parent: TAG_ID.dataAndInformation, comingSoon: true},
    {id: TAG_ID.compression, title: "Compression", parent: TAG_ID.dataAndInformation, comingSoon: true},
    {id: TAG_ID.encryption, title: "Encryption", parent: TAG_ID.dataAndInformation, comingSoon: true},

    // Functional programming topics
    {id: TAG_ID.functions, title: "Functions", parent: TAG_ID.functionalProgramming, comingSoon: true},
    {id: TAG_ID.lists, title: "Lists", parent: TAG_ID.functionalProgramming, comingSoon: true},
    {id: TAG_ID.higherOrderFunctions, title: "Higher order functions", parent: TAG_ID.functionalProgramming, comingSoon: true},
    // Object oriented programming topics
    {id: TAG_ID.creatingObjects, title: "Creating objects", parent: TAG_ID.objectOrientedProgramming, comingSoon: true},
    {id: TAG_ID.oopConcepts, title: "OOP concepts", parent: TAG_ID.objectOrientedProgramming, comingSoon: true},
    {id: TAG_ID.classDiagrams, title: "Class diagrams", parent: TAG_ID.objectOrientedProgramming, comingSoon: true},
    // Procedural programming topics
    {id: TAG_ID.programmingConcepts, title: "Programming concepts", parent: TAG_ID.proceduralProgramming, comingSoon: true},
    {id: TAG_ID.subroutines, title: "Subroutines", parent: TAG_ID.proceduralProgramming},
    {id: TAG_ID.files, title: "Files", parent: TAG_ID.proceduralProgramming},
    {id: TAG_ID.structureAndRobustness, title: "Structure & robustness", parent: TAG_ID.proceduralProgramming, comingSoon: true},
    {id: TAG_ID.dataStructuresImplementation, title: "Data structures (implementation)", parent: TAG_ID.proceduralProgramming, comingSoon: true},
    {id: TAG_ID.recursion, title: "Recursion", parent: TAG_ID.proceduralProgramming, comingSoon: true},
    {id: TAG_ID.stringManipulation, title: "String manipulation", parent: TAG_ID.proceduralProgramming, comingSoon: true},
    {id: TAG_ID.guis, title: "GUIs", parent: TAG_ID.proceduralProgramming, comingSoon: true},
    {id: TAG_ID.softwareEngineeringPrinciples, title: "Software engineering principles", parent: TAG_ID.proceduralProgramming, comingSoon: true},
    {id: TAG_ID.softwareProject, title: "Software project", parent: TAG_ID.proceduralProgramming, comingSoon: true},
];

const getBaseTagById = (id: TAG_ID) => {
    return baseTags.filter((tag) => tag.id === id)[0];
};
// Augment base allTags
export const allTags: Tag[] = baseTags.map((baseTag) => {
    let depth = 0;
    let parentId = baseTag.parent;
    if (parentId) {
        let parent = getBaseTagById(parentId);
        depth++;
        while (parent.parent) {
            depth++;
            parent = getBaseTagById(parent.parent);
        }
    }
    return Object.assign(baseTag, {type: TAG_HIERARCHY[depth], level: depth})
});
export const allTagIds = allTags.map((tag) => tag.id);

const getById = (id: TAG_ID) => {
    return allTags.filter((tag) => tag.id === id)[0];
};

const getSpecifiedTag = function(tagType: TAG_LEVEL, tagArray: TAG_ID[]) {
    // Return the first (as ordered in TAG_ID) TAG_ID an object has of a given type!
    if (tagArray != null) {
        for (let i in tagArray) {
            let tag = getById(tagArray[i]);
            if (tag != null && tag.type === tagType) {
                return tag;
            }
        }
    }
    return null;
};

const getAllSpecifiedTags = function(tagType: TAG_LEVEL, tagArray: TAG_ID[]) {
    // Return all TAG_ID an object has of a given type!
    if (tagArray == null) return [];
    let tags = [];
    for (let i in tagArray) {
        let tag = getById(tagArray[i]);
        if (tag != null && tag.type === tagType) {
            tags.push(tag);
        }
    }
    return tags;
};

// this.getPageSubjectTag = function(tagArray) {
//     // Extract the subject tag from a tag array,
//     // defaulting to the current site subject if no tags
//     // and intelligently choosing if more than one subject tag.
//     var globalSubjectTagId = subjectService.id;
//
//     if (tagArray == null || tagArray.length == 0) {
//         return this.getById(globalSubjectTagId);
//     }
//
//     var subjectTags = this.getAllSpecifiedTags("subject", tagArray);
//     for (var i in subjectTags) {
//         if (subjectTags[i].id == globalSubjectTagId) {
//             return subjectTags[i];
//         }
//     }
//     return subjectTags[0];
// };

export const getCategoryTag = getSpecifiedTag.bind(null, TAG_LEVEL.category);
export const getAllCategoryTags = getAllSpecifiedTags.bind(null, TAG_LEVEL.category);
export const allCategoryTags = getAllCategoryTags(allTagIds);

export const getSubcategoryTag = getSpecifiedTag.bind(null, TAG_LEVEL.subcategory);
export const getAllSubcategoryTags = getAllSpecifiedTags.bind(null, TAG_LEVEL.subcategory);

export const getTopicTag = getSpecifiedTag.bind(null, TAG_LEVEL.topic);
export const getAllTopicTags = getAllSpecifiedTags.bind(null, TAG_LEVEL.topic);

const getDeepestTag = function(tagArray: TAG_ID[]) {
    if (tagArray == null) return null;

    let deepestTag = null;
    for (let i in tagArray) {
        let tag = getById(tagArray[i]);
        if (tag != null && (deepestTag == null || tag.level > deepestTag.level)) {
            deepestTag = tag;
        }
    }
    return deepestTag;
};

export const getDescendents = function(tagId: TAG_ID) {
    let descendents: Tag[] = [];
    for (let i in allTags) {
        if (allTags[i].parent == tagId) {
            descendents.push(allTags[i]);
            descendents = descendents.concat(getDescendents(allTags[i].id));
        }
    }
    return descendents;
};

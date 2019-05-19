/*
    RPG Paper Maker Copyright (C) 2017-2019 Marie Laporte

    RPG Paper Maker engine is under LGPL-3 license.

    Commercial license for commercial use of your games:
        https://creativecommons.org/licenses/by-nc/4.0/.

    See more information here: http://rpg-paper-maker.com/index.php/downloads.
*/

#ifndef TARGETKIND_H
#define TARGETKIND_H

// -------------------------------------------------------
//
//  ENUM TargetKind
//
//  All the possible target kind for skills.
//
// -------------------------------------------------------

enum class TargetKind {
    None,
    User,
    Enemy,
    Ally,
    AllEnemies,
    AllAllies
};

#endif // TARGETKIND_H

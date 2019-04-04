/*
    RPG Paper Maker Copyright (C) 2017-2019 Marie Laporte

    RPG Paper Maker engine is under LGPL-3 license.

    Commercial license for commercial use of your games:
        https://creativecommons.org/licenses/by-nc/4.0/.

    See more information here: http://rpg-paper-maker.com/index.php/downloads.
*/

#ifndef MAPEDITORSELECTIONKIND_H
#define MAPEDITORSELECTIONKIND_H

// -------------------------------------------------------
//
//  ENUM MapEditorSelectionKind
//
//  All the types of selection for the map editor.
//
// -------------------------------------------------------

enum class MapEditorSelectionKind {
    Land,
    Sprites,
    Mountains,
    Objects3D,
    Objects,
    None
};

#endif // MAPEDITORSELECTIONKIND_H

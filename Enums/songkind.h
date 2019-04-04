/*
    RPG Paper Maker Copyright (C) 2017-2019 Marie Laporte

    RPG Paper Maker engine is under LGPL-3 license.

    Commercial license for commercial use of your games:
        https://creativecommons.org/licenses/by-nc/4.0/.

    See more information here: http://rpg-paper-maker.com/index.php/downloads.
*/

#ifndef SONGKIND_H
#define SONGKIND_H

#include <QMetaType>

// -------------------------------------------------------
//
//  ENUM SongKind
//
//  All the possible songs.
//
// -------------------------------------------------------

enum class SongKind {
    None,
    Music,
    BackgroundSound,
    Sound,
    MusicEffect
};

inline uint qHash(SongKind pos)
{
   return (int) pos;
}

Q_DECLARE_METATYPE(SongKind)

#endif // SONGKIND_H

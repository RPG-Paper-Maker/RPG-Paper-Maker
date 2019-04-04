/*
    RPG Paper Maker Copyright (C) 2017-2019 Marie Laporte

    RPG Paper Maker engine is under LGPL-3 license.

    Commercial license for commercial use of your games:
        https://creativecommons.org/licenses/by-nc/4.0/.

    See more information here: http://rpg-paper-maker.com/index.php/downloads.
*/

#ifndef SERIALIALIZABLE_H
#define SERIALIALIZABLE_H

#include <QJsonObject>
#include <QJsonArray>

// -------------------------------------------------------
//
//  CLASS Serializable
//
//  All the classes that can be written/read with json should
//  inherit this class in order to call RPM::read and RPM::write
//  methods.
//
// -------------------------------------------------------

class Serializable
{
public:
    virtual void read(const QJsonObject &json) = 0;
    virtual void write(QJsonObject &json) const = 0;
};

#endif // SERIALIALIZABLE_H

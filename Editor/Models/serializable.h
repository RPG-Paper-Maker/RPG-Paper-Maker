/*
    RPG Paper Maker Copyright (C) 2017-2021 Wano

    RPG Paper Maker engine is under proprietary license.
    This source code is also copyrighted.

    Use Commercial edition for commercial use of your games.
    See RPG Paper Maker EULA here:
        http://rpg-paper-maker.com/index.php/eula.
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

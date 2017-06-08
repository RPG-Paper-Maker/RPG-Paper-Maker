/*
    RPG Paper Maker Copyright (C) 2017 Marie Laporte

    This file is part of RPG Paper Maker.

    RPG Paper Maker is free software: you can redistribute it and/or modify
    it under the terms of the GNU General Public License as published by
    the Free Software Foundation, either version 3 of the License, or
    (at your option) any later version.

    RPG Paper Maker is distributed in the hope that it will be useful,
    but WITHOUT ANY WARRANTY; without even the implied warranty of
    MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
    GNU General Public License for more details.

    You should have received a copy of the GNU General Public License
    along with Foobar.  If not, see <http://www.gnu.org/licenses/>.
*/

#ifndef LANGSTRANSLATION_H
#define LANGSTRANSLATION_H

#include <QHash>
#include <QVector>
#include <QJsonObject>

// -------------------------------------------------------
//
//  CLASS LangsTranslation
//
//  All the possible translations of something.
//
// -------------------------------------------------------

class LangsTranslation
{
public:
    LangsTranslation();
    LangsTranslation(QString name);
    LangsTranslation(QVector<int> ids, QVector<QString> names);
    virtual ~LangsTranslation();
    int mainId() const;
    QString mainName() const;
    void setMainName(QString n);
    QString defaultMainName() const;
    void setCopy(const LangsTranslation& super);
    void updateNames();
    void setAllNames(QString n);

    void read(const QJsonObject &json);
    void write(QJsonObject &json) const;

protected:
    QHash<int,QString> m_names;
};

#endif // LANGSTRANSLATION_H

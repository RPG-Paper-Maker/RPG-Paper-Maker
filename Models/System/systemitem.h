/*
    RPG Paper Maker Copyright (C) 2017-2019 Marie Laporte

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

#ifndef SYSTEMITEM_H
#define SYSTEMITEM_H

#include <QMetaType>
#include "systemskill.h"

// -------------------------------------------------------
//
//  CLASS SystemItem
//
//  A particulary item (datas).
//
// -------------------------------------------------------

class SystemItem : public SystemSkill
{
public:
    SystemItem();
    SystemItem(int i, LangsTranslation *names, int idType, bool consumable);
    virtual ~SystemItem();
    bool consumable() const;
    void setConsumable(bool consumable);
    int idType() const;
    void setIdType(int t);

    virtual void read(const QJsonObject &json);
    virtual void write(QJsonObject &json) const;

protected:
    int m_idType;
    bool m_consumable;
};

Q_DECLARE_METATYPE(SystemItem)

#endif // SYSTEMITEM_H

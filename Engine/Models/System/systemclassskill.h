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

#ifndef SYSTEMCLASSSKILL_H
#define SYSTEMCLASSSKILL_H

#include <QMetaType>
#include "superlistitem.h"

// -------------------------------------------------------
//
//  CLASS SystemClassSkill
//
//  A particulary class skill (datas).
//
// -------------------------------------------------------

class SystemClassSkill : public SuperListItem
{
public:
    SystemClassSkill();
    SystemClassSkill(int i, QString n, int l);
    virtual ~SystemClassSkill();
    int level() const;
    void setLevel(int i);
    virtual bool openDialog();
    virtual SuperListItem* createCopy() const;
    virtual void setCopy(const SystemClassSkill &skill);
    virtual QList<QStandardItem*> getModelRow() const;

    virtual void read(const QJsonObject &json);
    virtual void write(QJsonObject &json) const;

protected:
    int m_level;
};

Q_DECLARE_METATYPE(SystemClassSkill)

#endif // SYSTEMCLASSSKILL_H

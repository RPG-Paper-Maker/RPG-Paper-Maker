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

#ifndef SYSTEMELEMENT_H
#define SYSTEMELEMENT_H

#include <QStandardItemModel>
#include <QMetaType>
#include "systemlang.h"

// -------------------------------------------------------
//
//  CLASS SystemElement
//
//  A particulary element (system).
//
// -------------------------------------------------------

class SystemElement : public SystemLang
{
public:
    SystemElement();
    SystemElement(int i, LangsTranslation *names,
                  QStandardItemModel* efficiency = new QStandardItemModel);
    virtual ~SystemElement();
    QStandardItemModel* efficiency() const;
    virtual bool openDialog();
    virtual void setCopy(const SystemElement& element);

    virtual void read(const QJsonObject &json);
    void readEfficiency(QStandardItemModel* model, const QJsonObject &json);
    virtual void write(QJsonObject &json) const;

protected:
    QStandardItemModel* m_efficiency;
};

Q_DECLARE_METATYPE(SystemElement)

#endif // SYSTEMELEMENT_H

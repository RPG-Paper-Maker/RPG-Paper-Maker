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

#ifndef PRIMITIVEVALUE_H
#define PRIMITIVEVALUE_H

#include <QString>
#include <QJsonObject>
#include <QStandardItemModel>
#include "primitivevaluekind.h"
#include "eventcommand.h"

// -------------------------------------------------------
//
//  CLASS PrimitiveValue
//
//  A primitive value can be a number, a message, or a switch.
//
// -------------------------------------------------------

class PrimitiveValue
{
public:
    PrimitiveValue();
    PrimitiveValue(int n);
    PrimitiveValue(double n);
    PrimitiveValue(QString m);
    PrimitiveValue(bool s);
    PrimitiveValue(PrimitiveValueKind kind);
    static PrimitiveValue* createKeyBoard(int id);
    QStandardItemModel* modelParameter() const;
    void setModelParameter(QStandardItemModel* model);
    QStandardItemModel* modelProperties() const;
    void setModelProperties(QStandardItemModel* model);
    QStandardItemModel* modelDataBase() const;
    void setModelDataBase(QStandardItemModel* model);
    QString toString() const;
    void labelTab(QString& str) const;
    int numberValue() const;
    double numberDoubleValue() const;
    QString messageValue() const;
    bool switchValue() const;
    void setNumberValue(int n);
    void setNumberDoubleValue(double n);
    void setMessageValue(QString m);
    void setSwitchValue(bool s);
    PrimitiveValueKind kind() const;
    void setKind(PrimitiveValueKind k);
    void setCopy(const PrimitiveValue &prim);
    void initializeCommandParameter(const EventCommand *command, int& i);
    void getCommandParameter(QVector<QString> &command);

    void read(const QJsonObject &json);
    void write(QJsonObject &json) const;

protected:
    PrimitiveValueKind m_kind;
    int m_numberValue;
    double m_numberDoubleValue;
    QString m_messageValue;
    bool m_switchValue;
    QStandardItemModel* m_modelParameter;
    QStandardItemModel* m_modelProperties;
    QStandardItemModel* m_modelDataBase;
};

#endif // PRIMITIVEVALUE_H

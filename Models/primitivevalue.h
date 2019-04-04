/*
    RPG Paper Maker Copyright (C) 2017-2019 Marie Laporte

    RPG Paper Maker engine is under LGPL-3 license.

    Commercial license for commercial use of your games:
        https://creativecommons.org/licenses/by-nc/4.0/.

    See more information here: http://rpg-paper-maker.com/index.php/downloads.
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
    PrimitiveValue(PrimitiveValueKind kind, int n);

    static PrimitiveValue * createKeyBoard(int id);
    static PrimitiveValue * createDefaultDataBaseValue();
    static PrimitiveValue * createDefaultNumberValue();
    static PrimitiveValue * createDefaultMessageValue();

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
    bool isDefaultDataBaseValue() const;
    bool isDefaultNumberValue() const;
    bool isDefaultMessageValue() const;

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

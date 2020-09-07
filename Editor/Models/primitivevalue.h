/*
    RPG Paper Maker Copyright (C) 2017-2020 Wano

    RPG Paper Maker engine is under proprietary license.
    This source code is also copyrighted.

    Use Commercial edition for commercial use of your games.
    See RPG Paper Maker EULA here:
        http://rpg-paper-maker.com/index.php/eula.
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
    static const QString JSON_IS_ACTIVATED;

    PrimitiveValue();
    PrimitiveValue(int n);
    PrimitiveValue(double n);
    PrimitiveValue(QString m);
    PrimitiveValue(bool s);
    PrimitiveValue(PrimitiveValueKind kind);
    PrimitiveValue(PrimitiveValueKind kind, int n);
    PrimitiveValue(PrimitiveValueKind kind, QString m);

    PrimitiveValueKind kind() const;
    void setKind(PrimitiveValueKind k);
    int numberValue() const;
    void setNumberValue(int n);
    double numberDoubleValue() const;
    void setNumberDoubleValue(double n);
    QString messageValue() const;
    void setMessageValue(QString m);
    bool switchValue() const;
    void setSwitchValue(bool s);
    bool isActivated() const;
    void setIsActivated(bool ia);
    QStandardItemModel* modelParameter() const;
    void setModelParameter(QStandardItemModel* model);
    QStandardItemModel* modelProperties() const;
    void setModelProperties(QStandardItemModel* model);
    QStandardItemModel* modelDataBase() const;
    void setModelDataBase(QStandardItemModel* model);

    static PrimitiveValue * createKeyBoard(int id);
    static PrimitiveValue * createDefaultDataBaseValue();
    static PrimitiveValue * createDefaultNumberValue();
    static PrimitiveValue * createDefaultMessageValue();

    QString toString() const;
    void labelTab(QString& str) const;
    bool isDefaultDataBaseValue() const;
    bool isDefaultNumberValue() const;
    bool isDefaultNumberDoubleValue() const;
    bool isDefaultMessageValue() const;
    void initializeCommandParameter(const EventCommand *command, int& i, bool
        active = false);
    void initializeCommands(const QVector<QString> &command, int &i, bool active
        = false);
    void getCommandParameter(QVector<QString> &command, bool active = false);
    PrimitiveValue * createCopy() const;
    void setCopy(const PrimitiveValue &prim);
    void read(const QJsonObject &json);
    void write(QJsonObject &json) const;

protected:
    PrimitiveValueKind m_kind;
    int m_numberValue;
    double m_numberDoubleValue;
    QString m_messageValue;
    bool m_switchValue;
    bool m_isActivated;
    QStandardItemModel* m_modelParameter;
    QStandardItemModel* m_modelProperties;
    QStandardItemModel* m_modelDataBase;
};

#endif // PRIMITIVEVALUE_H

/*
    RPG Paper Maker Copyright (C) 2017-2023 Wano

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
#include "systemcustomstructure.h"

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
    static const QString JSON_CUSTOM_STRUCTURE;
    static const QString JSON_CUSTOM_LIST;
    static const QString JSON_X;
    static const QString JSON_Y;
    static const QString JSON_Z;
    static const QString JSON_MIN;
    static const QString JSON_MAX;

    PrimitiveValue();
    PrimitiveValue(int n);
    PrimitiveValue(double n);
    PrimitiveValue(QString m);
    PrimitiveValue(bool s);
    PrimitiveValue(PrimitiveValueKind kind);
    PrimitiveValue(PrimitiveValueKind kind, int n);
    PrimitiveValue(PrimitiveValueKind kind, QString m);
    ~PrimitiveValue();

    PrimitiveValueKind kind() const;
    void setKind(PrimitiveValueKind k);
    int numberValue() const;
    void setNumberValue(int n);
    double numberDoubleValue() const;
    void setNumberDoubleValue(double n);
    QString messageValue() const;
    void setMessageValue(QString m);
    bool switchValue() const;
    SystemCustomStructure * customStructure();
    SystemCustomStructure * customList();
    PrimitiveValue * x() const;
    void setX(PrimitiveValue *x);
    PrimitiveValue * y() const;
    void setY(PrimitiveValue *y);
    PrimitiveValue * z() const;
    void setZ(PrimitiveValue *z);
    int min() const;
    void setMin(int min);
    int max() const;
    void setMax(int max);
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
    static PrimitiveValue * createDefaultNumberDoubleValue();
    static PrimitiveValue * createDefaultMessageValue();
    static PrimitiveValue * createDefaultSwitchValue();

    QString toString() const;
    bool isFixNumberValue() const;
    bool isMinActivated() const;
    bool isMaxActivated() const;
    void labelTab(QString& str) const;
    bool isDefaultDataBaseValue() const;
    bool isDefaultNumberValue(int value = 0) const;
    bool isDefaultNumberDoubleValue() const;
    bool isDefaultMessageValue() const;
    bool isDefaultSwitchValue() const;
    void initializeCommandParameter(const EventCommand *command, int& i, bool
        active = false);
    void initializeCommands(const QVector<QString> &command, int &i, bool active
        = false);
    void getCommandParameter(QVector<QString> &command, bool active = false);
    void updateModelsParametersProperties(QStandardItemModel *parameters,
        QStandardItemModel *properties);
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
    SystemCustomStructure *m_customStructure;
    SystemCustomStructure *m_customList;
    PrimitiveValue *m_x;
    PrimitiveValue *m_y;
    PrimitiveValue *m_z;
    int m_min;
    int m_max;
    bool m_isActivated;
    QStandardItemModel* m_modelParameter;
    QStandardItemModel* m_modelProperties;
    QStandardItemModel* m_modelDataBase;
};

#endif // PRIMITIVEVALUE_H

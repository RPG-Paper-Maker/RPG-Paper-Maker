/*
    RPG Paper Maker Copyright (C) 2017-2021 Wano

    RPG Paper Maker engine is under proprietary license.
    This source code is also copyrighted.

    Use Commercial edition for commercial use of your games.
    See RPG Paper Maker EULA here:
        http://rpg-paper-maker.com/index.php/eula.
*/

#ifndef SYSTEMSTATUSRELEASETURN_H
#define SYSTEMSTATUSRELEASETURN_H

#include <QMetaType>
#include "superlistitem.h"
#include "operationkind.h"
#include "primitivevalue.h"

// -------------------------------------------------------
//
//  CLASS SystemStatusReleaseTurn
//
//  A particulary status release turn.
//
// -------------------------------------------------------

class SystemStatusReleaseTurn : public SuperListItem
{
public:
    static const QString JSON_OPERATION_TURN_KIND;
    static const QString JSON_TURN;
    static const QString JSON_CHANCE;
    static const OperationKind DEFAULT_OPERATION_TURN_KIND;
    static const int DEFAULT_TURN;
    static const double DEFAULT_CHANCE;

    SystemStatusReleaseTurn();
    SystemStatusReleaseTurn(int i, QString name, OperationKind operationTurnKind =
        DEFAULT_OPERATION_TURN_KIND, PrimitiveValue *turn = new PrimitiveValue(
        DEFAULT_TURN), PrimitiveValue *chance = new PrimitiveValue(DEFAULT_CHANCE));
    virtual ~SystemStatusReleaseTurn();
    OperationKind operationTurnKind() const;
    void setOperationTurnKind(OperationKind operationTurnKind);
    PrimitiveValue * turn() const;
    PrimitiveValue * chance() const;

    virtual void setDefault();
    virtual bool openDialog();
    virtual SuperListItem * createCopy() const;
    virtual void setCopy(const SuperListItem &super);
    virtual QList<QStandardItem*> getModelRow() const;
    virtual void read(const QJsonObject &json);
    virtual void write(QJsonObject &json) const;

protected:
    OperationKind m_operationTurnKind;
    PrimitiveValue *m_turn;
    PrimitiveValue *m_chance;
};

Q_DECLARE_METATYPE(SystemStatusReleaseTurn)

#endif // SYSTEMSTATUSRELEASETURN_H

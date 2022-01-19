/*
    RPG Paper Maker Copyright (C) 2017-2022 Wano

    RPG Paper Maker engine is under proprietary license.
    This source code is also copyrighted.

    Use Commercial edition for commercial use of your games.
    See RPG Paper Maker EULA here:
        http://rpg-paper-maker.com/index.php/eula.
*/

#ifndef SYSTEMCOMMANDMOVE_H
#define SYSTEMCOMMANDMOVE_H

#include "superlistitem.h"
#include "eventcommand.h"
#include "commandmovekind.h"

// -------------------------------------------------------
//
//  CLASS SystemCommandMove
//
//  A particulary command move (system).
//
// -------------------------------------------------------

class SystemCommandMove : public SuperListItem
{
public:
    SystemCommandMove(int i = -1, QString n = "", QVector<QString> command =
        QVector<QString>(), QStandardItemModel *properties = nullptr,
        QStandardItemModel *parameters = nullptr);

    CommandMoveKind getKind() const;
    void getCommand(QVector<QString> &command) const;
    void initializePropertiesParameters(QStandardItemModel *properties,
        QStandardItemModel *parameters);
    void initialize(const EventCommand* command, int& i);

    virtual QString toString() const;
    virtual bool openDialog();
    virtual SuperListItem* createCopy() const;
    virtual void setCopy(const SuperListItem &super);
    virtual QList<QStandardItem*> getModelRow() const;

protected:
    QVector<QString> m_command;
    QStandardItemModel *m_properties;
    QStandardItemModel *m_parameters;
};

#endif // SYSTEMCOMMANDMOVE_H

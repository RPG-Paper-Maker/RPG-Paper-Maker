/*
    RPG Paper Maker Copyright (C) 2017-2021 Wano

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
    SystemCommandMove();
    SystemCommandMove(int i, QString n, QVector<QString> command);
    virtual QString toString() const;
    void initialize(const EventCommand* command, int& i);
    void getCommand(QVector<QString> &command);
    virtual QList<QStandardItem*> getModelRow() const;

protected:
    QVector<QString> m_command;
};

#endif // SYSTEMCOMMANDMOVE_H

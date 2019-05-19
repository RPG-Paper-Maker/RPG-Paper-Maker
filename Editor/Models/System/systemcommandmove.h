/*
    RPG Paper Maker Copyright (C) 2017-2019 Marie Laporte

    RPG Paper Maker engine is under LGPL-3 license.

    Commercial license for commercial use of your games:
        https://creativecommons.org/licenses/by-nc/4.0/.

    See more information here: http://rpg-paper-maker.com/index.php/downloads.
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

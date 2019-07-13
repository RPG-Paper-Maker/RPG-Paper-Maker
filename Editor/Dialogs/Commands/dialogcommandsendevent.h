/*
    RPG Paper Maker Copyright (C) 2017-2019 Wano

    RPG Paper Maker engine is under proprietary license.
    This source code is also copyrighted.

    Use Commercial edition for commercial use of your games.
    See RPG Paper Maker EULA here:
        http://rpg-paper-maker.com/index.php/eula.
*/

#ifndef DIALOGCOMMANDSENDEVENT_H
#define DIALOGCOMMANDSENDEVENT_H

#include "dialogcommand.h"
#include "systemobjectevent.h"

// -------------------------------------------------------
//
//  CLASS DialogCommandMoveObject
//
//  A dialog used for sending events to one or several objects.
//
// -------------------------------------------------------

namespace Ui {
class DialogCommandSendEvent;
}

class DialogCommandSendEvent : public DialogCommand
{
    Q_OBJECT

public:
    explicit DialogCommandSendEvent(EventCommand *command = nullptr,
                                    QWidget *parent = 0);
    ~DialogCommandSendEvent();
    EventCommand* getCommand() const;

protected:
    virtual void initialize(EventCommand*command);

private:
    Ui::DialogCommandSendEvent *ui;
    SystemObjectEvent* m_event;

    void chooseTarget(QVector<QString> &command) const;
};

#endif // DIALOGCOMMANDSENDEVENT_H

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
        SystemCommonObject *object = nullptr, QStandardItemModel *parameters =
        nullptr, QWidget *parent = nullptr);
    ~DialogCommandSendEvent();
    EventCommand* getCommand() const;

protected:
    virtual void initialize(EventCommand*command);

private:
    Ui::DialogCommandSendEvent *ui;
    SystemObjectEvent* m_event;
    QStandardItemModel *m_modelObjects;

    void chooseTarget(QVector<QString> &command) const;

public slots:
    void on_radioButtonDetection_toggled(bool checked);
    void on_radioButtonObject_toggled(bool checked);
};

#endif // DIALOGCOMMANDSENDEVENT_H

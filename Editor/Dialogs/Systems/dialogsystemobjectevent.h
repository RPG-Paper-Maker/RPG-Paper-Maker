/*
    RPG Paper Maker Copyright (C) 2017-2022 Wano

    RPG Paper Maker engine is under proprietary license.
    This source code is also copyrighted.

    Use Commercial edition for commercial use of your games.
    See RPG Paper Maker EULA here:
        http://rpg-paper-maker.com/index.php/eula.
*/

#ifndef DIALOGSYSTEMOBJECTEVENT_H
#define DIALOGSYSTEMOBJECTEVENT_H

#include <QDialog>
#include "systemobjectevent.h"
#include "systemevent.h"

// -------------------------------------------------------
//
//  CLASS DialogSystemObjectEvent
//
//  A dialog used for editing the model of a system object event.
//
// -------------------------------------------------------

namespace Ui {
class DialogSystemObjectEvent;
}

class DialogSystemObjectEvent : public QDialog
{
    Q_OBJECT

public:
    explicit DialogSystemObjectEvent(SystemObjectEvent& event,
                                     QWidget *parent = 0);
    ~DialogSystemObjectEvent();

private:
    Ui::DialogSystemObjectEvent *ui;
    SystemObjectEvent& m_event;

    void initialize();
    void translate();
};

#endif // DIALOGSYSTEMOBJECTEVENT_H

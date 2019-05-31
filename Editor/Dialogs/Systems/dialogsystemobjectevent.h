/*
    RPG Paper Maker Copyright (C) 2017-2019 Marie Laporte

    RPG Paper Maker engine is under LGPL-3 license.

    Commercial license for commercial use of your games:
        https://creativecommons.org/licenses/by-nc/4.0/.

    See more information here: http://rpg-paper-maker.com/index.php/downloads.
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
};

#endif // DIALOGSYSTEMOBJECTEVENT_H

/*
    RPG Paper Maker Copyright (C) 2017-2019 Marie Laporte

    RPG Paper Maker engine is under LGPL-3 license.

    Commercial license for commercial use of your games:
        https://creativecommons.org/licenses/by-nc/4.0/.

    See more information here: http://rpg-paper-maker.com/index.php/downloads.
*/

#ifndef PANELOBJECTEVENT_H
#define PANELOBJECTEVENT_H

#include <QWidget>
#include "systemobjectevent.h"
#include "systemevent.h"

// -------------------------------------------------------
//
//  CLASS PanelObjectEvent
//
//  The event panel for an event and its parameters.
//
// -------------------------------------------------------

namespace Ui {
class PanelObjectEvent;
}

class PanelObjectEvent : public QWidget
{
    Q_OBJECT

public:
    explicit PanelObjectEvent(QWidget *parent = nullptr);
    virtual ~PanelObjectEvent();

    void initialize(SystemObjectEvent *event);
    SystemObjectEvent * initializeCommand(const EventCommand *command, int &i);
    void getCommandObjectEvent(QVector<QString> &command) const;

private:
    Ui::PanelObjectEvent *ui;
    SystemObjectEvent *m_event;

    void updateEvent(SystemEvent *ev);
    void updateParameters(SystemEvent *);

private slots:
    void on_comboBoxEventsSystemCurrentIndexChanged(int index);
    void on_comboBoxEventsUserCurrentIndexChanged(int index);
    void on_radioButtonEventSystem_toggled(bool checked);
    void on_radioButtonEventUser_toggled(bool checked);
};

#endif // PANELOBJECTEVENT_H

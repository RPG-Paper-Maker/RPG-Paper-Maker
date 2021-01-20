/*
    RPG Paper Maker Copyright (C) 2017-2021 Wano

    RPG Paper Maker engine is under proprietary license.
    This source code is also copyrighted.

    Use Commercial edition for commercial use of your games.
    See RPG Paper Maker EULA here:
        http://rpg-paper-maker.com/index.php/eula.
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
    void translate();

private slots:
    void on_comboBoxEventsSystemCurrentIndexChanged(int index);
    void on_comboBoxEventsUserCurrentIndexChanged(int index);
    void on_radioButtonEventSystem_toggled(bool checked);
    void on_radioButtonEventUser_toggled(bool checked);
};

#endif // PANELOBJECTEVENT_H

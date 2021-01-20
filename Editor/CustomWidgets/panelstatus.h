/*
    RPG Paper Maker Copyright (C) 2017-2021 Wano

    RPG Paper Maker engine is under proprietary license.
    This source code is also copyrighted.

    Use Commercial edition for commercial use of your games.
    See RPG Paper Maker EULA here:
        http://rpg-paper-maker.com/index.php/eula.
*/

#ifndef PANELSTATUS_H
#define PANELSTATUS_H

#include <QWidget>
#include "systemstatus.h"

// -------------------------------------------------------
//
//  CLASS PanelStatus
//
//  Panel used for status datas.
//
// -------------------------------------------------------

namespace Ui {
class PanelStatus;
}

class PanelStatus : public QWidget
{
    Q_OBJECT

public:
    explicit PanelStatus(QWidget *parent = nullptr);
    ~PanelStatus();

    void initializePrimitives();
    void initializeModel(SystemStatus *model);

private:
    Ui::PanelStatus *ui;
    SystemStatus *m_model;
};

#endif // PANELSTATUS_H

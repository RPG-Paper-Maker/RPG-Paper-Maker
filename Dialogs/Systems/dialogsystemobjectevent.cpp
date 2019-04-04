/*
    RPG Paper Maker Copyright (C) 2017-2019 Marie Laporte

    RPG Paper Maker engine is under LGPL-3 license.

    Commercial license for commercial use of your games:
        https://creativecommons.org/licenses/by-nc/4.0/.

    See more information here: http://rpg-paper-maker.com/index.php/downloads.
*/

#include "dialogsystemobjectevent.h"
#include "ui_dialogsystemobjectevent.h"

DialogSystemObjectEvent::DialogSystemObjectEvent(SystemObjectEvent &event,
                                                 QWidget *parent) :
    QDialog(parent),
    ui(new Ui::DialogSystemObjectEvent),
    m_event(event)
{
    ui->setupUi(this);
    

    initialize();
}

DialogSystemObjectEvent::~DialogSystemObjectEvent()
{
    delete ui;
}

// -------------------------------------------------------
//
//  INTERMEDIARY FUNCTIONS
//
// -------------------------------------------------------

void DialogSystemObjectEvent::initialize(){
    ui->widget->initialize(&m_event);
}

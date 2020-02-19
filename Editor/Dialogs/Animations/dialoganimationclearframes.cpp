/*
    RPG Paper Maker Copyright (C) 2017-2019 Wano

    RPG Paper Maker engine is under proprietary license.
    This source code is also copyrighted.

    Use Commercial edition for commercial use of your games.
    See RPG Paper Maker EULA here:
        http://rpg-paper-maker.com/index.php/eula.
*/

#include "dialoganimationclearframes.h"
#include "ui_dialoganimationclearframes.h"
#include "systemanimationframe.h"

// -------------------------------------------------------
//
//  CONSTRUCTOR / DESTRUCTOR / GET / SET
//
// -------------------------------------------------------

DialogAnimationClearFrames::DialogAnimationClearFrames(QWidget *parent) :
    QDialog(parent),
    ui(new Ui::DialogAnimationClearFrames)
{
    ui->setupUi(this);
}

DialogAnimationClearFrames::~DialogAnimationClearFrames() {
    delete ui;
}

// -------------------------------------------------------
//
//  INTERMEDIARY FUNCTIONS
//
// -------------------------------------------------------

void DialogAnimationClearFrames::clearFrames(SystemAnimation *animation) {
    SystemAnimationFrame *frame;
    int i, from, to;

    from = ui->spinBoxFrom->value();
    to = ui->spinBoxTo->value();
    for (i = from; i <= to; i++) {
        frame = reinterpret_cast<SystemAnimationFrame *>(SuperListItem::getById(
            animation->framesModel()->invisibleRootItem(), i, false));
        if (frame != nullptr) {
            frame->clear();
        }
    }
}

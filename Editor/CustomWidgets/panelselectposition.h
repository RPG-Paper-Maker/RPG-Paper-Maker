/*
    RPG Paper Maker Copyright (C) 2017-2019 Wano

    RPG Paper Maker engine is under proprietary license.
    This source code is also copyrighted.

    Use Commercial edition for commercial use of your games.
    See RPG Paper Maker EULA here:
        http://rpg-paper-maker.com/index.php/eula.
*/

#ifndef PANELSELECTPOSITION_H
#define PANELSELECTPOSITION_H

#include <QWidget>
#include "eventcommand.h"

// -------------------------------------------------------
//
//  CLASS PanelSelectPosition
//
//  Used for having the option to select a position opening the dialog select
//  position.
//
// -------------------------------------------------------

namespace Ui {
class PanelSelectPosition;
}

class PanelSelectPosition : public QWidget
{
    Q_OBJECT

public:
    explicit PanelSelectPosition(QWidget *parent = nullptr);
    ~PanelSelectPosition();

    void getCommand(QVector<QString> &command) const;
    virtual void initialize(EventCommand* command, int &i);
    virtual void setEnabled(bool checked);

private:
    Ui::PanelSelectPosition *ui;

    void translate();

private slots:
    void on_pushButtonSelect_clicked();
};

#endif // PANELSELECTPOSITION_H

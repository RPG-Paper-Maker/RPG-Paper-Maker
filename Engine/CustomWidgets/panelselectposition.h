/*
    RPG Paper Maker Copyright (C) 2017-2019 Marie Laporte

    RPG Paper Maker engine is under LGPL-3 license.

    Commercial license for commercial use of your games:
        https://creativecommons.org/licenses/by-nc/4.0/.

    See more information here: http://rpg-paper-maker.com/index.php/downloads.
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

private slots:
    void on_pushButtonSelect_clicked();
};

#endif // PANELSELECTPOSITION_H

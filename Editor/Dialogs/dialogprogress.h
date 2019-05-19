/*
    RPG Paper Maker Copyright (C) 2017-2019 Marie Laporte

    RPG Paper Maker engine is under LGPL-3 license.

    Commercial license for commercial use of your games:
        https://creativecommons.org/licenses/by-nc/4.0/.

    See more information here: http://rpg-paper-maker.com/index.php/downloads.
*/

#ifndef DIALOGPROGRESS_H
#define DIALOGPROGRESS_H

#include <QDialog>

// -------------------------------------------------------
//
//  CLASS DialogProgress
//
//  Dialog used for displaying progress.
//
// -------------------------------------------------------

namespace Ui {
class DialogProgress;
}

class DialogProgress : public QDialog
{
    Q_OBJECT

public:
    explicit DialogProgress(QWidget *parent = 0);
    ~DialogProgress();

private:
    Ui::DialogProgress *ui;
    int m_totalCount;
    int m_count;
    int m_beginValue;
    int m_endValue;

public slots:
    void setValueLabel(int v, QString s);
    void setDescription(QString s);
    void setCount(int v);
    void addOne();
};

#endif // DIALOGPROGRESS_H

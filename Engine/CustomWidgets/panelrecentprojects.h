/*
    RPG Paper Maker Copyright (C) 2017-2019 Marie Laporte

    RPG Paper Maker engine is under LGPL-3 license.

    Commercial license for commercial use of your games:
        https://creativecommons.org/licenses/by-nc/4.0/.

    See more information here: http://rpg-paper-maker.com/index.php/downloads.
*/

#ifndef PANELRECENTPROJECTS_H
#define PANELRECENTPROJECTS_H

#include <QWidget>
#include <QStaticText>

class PanelRecentProjects : public QWidget
{
    Q_OBJECT
public:
    static const int RECT_HEIGHT;
    static const int RECT_X;
    static const int RECT_Y;
    static const int RECT_Y_TITLE;
    static const int RECT_OFFSET_Y_NAME;
    static const int RECT_OFFSET_Y_LINK;
    static const QString MESSAGE_EMPTY;

    explicit PanelRecentProjects(QWidget *parent = nullptr);
    ~PanelRecentProjects();

    void initialize();
    bool isMouseSelecting(const QPoint &pos);

protected:
    QStaticText m_staticTitle;
    int m_indexSelectedProject;

    virtual void leaveEvent(QEvent *);
    virtual void mousePressEvent(QMouseEvent *);
    virtual void mouseMoveEvent(QMouseEvent *event);
    virtual void paintEvent(QPaintEvent *);

signals:
    void openingProject(QString path);
};

#endif // PANELRECENTPROJECTS_H
